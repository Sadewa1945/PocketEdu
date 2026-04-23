<?php

namespace App\Filament\Resources\Fines;

use App\Filament\Resources\Fines\Pages\CreateFine;
use App\Filament\Resources\Fines\Pages\EditFine;
use App\Filament\Resources\Fines\Pages\ListFines;
use App\Filament\Resources\Fines\Schemas\FineForm;
use App\Filament\Resources\Fines\Tables\FinesTable;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use App\Models\Fine;
use App\Models\FinesSettings;
use App\Models\ReturnBook;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class FineResource extends Resource
{
    protected static ?string $model = Fine::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Transactions';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
{
    return $schema->schema([
       Select::make('return_book_id')
        ->relationship('returnBook', 'id')
        ->label('Return ID')
        ->getOptionLabelFromRecordUsing(fn ($record) => "ID: {$record->id} - Buku: {$record->borrowing->borrowingsBook->title} ({$record->borrowing->borrowingsUser->name})")
        ->getSearchResultsUsing(function (string $search): array {
            return ReturnBook::whereHas('borrowing.borrowingsUser', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orWhereHas('borrowing.borrowingsBook', function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->limit(50)
            ->get()
            ->mapWithKeys(fn ($record) => [
                $record->id => "ID: {$record->id} - Buku: {$record->borrowing->borrowingsBook->title} ({$record->borrowing->borrowingsUser->name})"
            ])
            ->toArray();
        })
        ->searchable()
        ->required()
        ->live()
        ->afterStateUpdated(function ($state, callable $set) {
            if ($state) {
                $returnBook = ReturnBook::with(['borrowing.borrowingsUser', 'borrowing.borrowingsBook'])->find($state);
                
                if ($returnBook && $returnBook->borrowing) {
                    $set('user_id', $returnBook->borrowing->user_id);
                    $set('fine_id', null);
                    $set('amount', 0);
                }
            } else {
                $set('user_id', null);
                $set('fine_id', null);
                $set('amount', 0);
            }
        }),

        Select::make('user_id')
            ->relationship('user', 'name')
            ->label('Borrower')
            ->required()
            ->disabled() 
            ->dehydrated(), 

        Select::make('fine_id')
            ->label('Fine Name')
            ->options(FinesSettings::all()->pluck('fine_name', 'id'))
            ->required()
            ->live()
            ->afterStateUpdated(function ($state, callable $set, callable $get) {
                $fineSetting = FinesSettings::find($state);
                $returnBookId = $get('return_book_id');

                if ($fineSetting && $returnBookId) {
                
                    $returnBook = ReturnBook::with(['borrowing.borrowingsBook'])->find($returnBookId);
                    $calculatedAmount = 0;
                    $value = $fineSetting->value;

                    if ($fineSetting->fine_categories === 'late') {
                        $returnedAt = \Carbon\Carbon::parse($returnBook->returned_at);
                        $dueAt = \Carbon\Carbon::parse($returnBook->borrowing->due_at);

                        if ($returnedAt->gt($dueAt)) {
                            $diffDays = (int) $returnedAt->diffInDays($dueAt, true);
                            
                            $calculatedAmount = $value * $diffDays;
                        } else {
                            $calculatedAmount = 0;
                        }
                    }
                    
                    else if ($fineSetting->fine_categories === 'damaged_or_lost') {
                        if ($fineSetting->type === 'percentage') {
                            $bookPrice = $returnBook->borrowing->borrowingsBook->book_price;
                            $calculatedAmount = ($value / 100) * $bookPrice;
                        } else {
                            $calculatedAmount = $value;
                        }
                    }
                    $set('amount', $calculatedAmount);
                } else {
                    $set('amount', 0);
                }
            }),

        TextInput::make('amount')
            ->numeric()
            ->prefix('Rp')
            ->required(),

        Select::make('status')
            ->options([
                'unpaid' => 'Unpaid',
                'paid' => 'Paid',
            ])
            ->default('unpaid')
            ->required()
            ->live()
            ->afterStateUpdated(function ($state, callable $set) {
                if ($state === 'paid') {
                    $set('paid_at', now());
                } else {
                    $set('paid_at', null);
                }
            }),
    ]);
}

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('Borrower')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('amount')
                    ->label('Amount')
                    ->money('idr')
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'unpaid' => 'danger',
                        'paid' => 'success',
                        default => 'gray',
                    }),

                TextColumn::make('paid_at')
                    ->label('Paid At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->actions([
                Action::make('pay')
                    ->label('Pay off')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Payment Confirmation')
                    ->modalDescription('Make sure you have received cash from the borrower before proceeding.')
                    ->action(function (Fine $record) {
                        $record->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                        ]);
                    })
                    ->hidden(fn (Fine $record) => $record->status === 'paid'),

                EditAction::make(),

                DeleteAction::make()
                    ->modalHeading('Delete Fine')
                    ->modalDescription('This action cannot be undone. Are you sure?'),
            ])->filters([
                DateRangeFilter::make('created_at'),

                SelectFilter::make('fine_id')
                    ->label('Fine')
                    ->options(fn () => FinesSettings::pluck('fine_name', 'id')->toArray())
                    ->searchable()
                    ->preload(),
            ])
            
            ->headerActions([
            ExportAction::make()->label('Export Excel'),
        ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFines::route('/'),
            'create' => CreateFine::route('/create'),
            'edit' => EditFine::route('/{record}/edit'),
        ];
    }
}
