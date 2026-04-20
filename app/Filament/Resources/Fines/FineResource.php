<?php

namespace App\Filament\Resources\Fines;

use App\Filament\Resources\Fines\Pages\CreateFine;
use App\Filament\Resources\Fines\Pages\EditFine;
use App\Filament\Resources\Fines\Pages\ListFines;
use App\Filament\Resources\Fines\Schemas\FineForm;
use App\Filament\Resources\Fines\Tables\FinesTable;
use App\Models\Fine;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
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
            ->label('Return ID / Data Pengembalian')
            ->getOptionLabelFromRecordUsing(fn ($record) => "ID: {$record->id} - Buku: {$record->borrowing->borrowingsBook->title} ({$record->borrowing->borrowingsUser->name})")
            ->searchable()
            ->required()
            ->live()
            ->afterStateUpdated(function ($state, callable $set) {
                if ($state) {
        
                    $returnBook = \App\Models\ReturnBook::with('borrowing.borrowingsUser')->find($state);
                    
                    if ($returnBook && $returnBook->borrowing) {
                        
                        $set('user_id', $returnBook->borrowing->user_id);
                        $set('borrower_name', $returnBook->borrowing->borrowingsUser->name);
                    }
                } else {
                    $set('user_id', null);
                    $set('borrower_name', null);
                }
            }),

        TextInput::make('borrower_name')
            ->label('Nama Peminjam')
            ->disabled() 
            ->dehydrated(false), 

        Select::make('user_id')
            ->relationship('user', 'name')
            ->label('User ID')
            ->required()
            ->disabled() 
            ->dehydrated(), 

        Select::make('fine_type')
            ->options([
                'late' => 'Late Fine',
                'damage' => 'Damage Fine',
                'lost' => 'Lost Fine',
            ])
            ->required(),

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

        DateTimePicker::make('paid_at')
            ->label('Paid At'),
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

                TextColumn::make('fine_type')
                    ->label('Type')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'late' => 'Late',
                        'damage' => 'Damage',
                        'lost' => 'Lost',
                        default => $state,
                    }),

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
                    ->label('Lunasi')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi Pembayaran')
                    ->modalDescription('Pastikan Anda sudah menerima uang tunai dari peminjam sebelum melanjutkan.')
                    ->action(function (Fine $record) {
                        $record->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                        ]);
                    })
                    ->hidden(fn (Fine $record) => $record->status === 'paid'),

                EditAction::make(),
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
