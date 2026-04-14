<?php

namespace App\Filament\Resources\Returns;

use App\Filament\Resources\Returns\Pages\CreateReturn;
use App\Filament\Resources\Returns\Pages\EditReturn;
use App\Filament\Resources\Returns\Pages\ListReturns;
use App\Filament\Resources\Returns\Schemas\ReturnForm;
use App\Filament\Resources\Returns\Tables\ReturnsTable;
use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class ReturnResource extends Resource
{
    protected static ?string $model = ReturnBook::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Transactions';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([

            Select::make('user_filter')
                ->label('Filter User')
                ->options(
                    User::pluck('name', 'id')
                )
                ->searchable()
                ->live()
                ->afterStateUpdated(function ($state, callable $set) {
                    $set('borrowing_id', null);
                }),

            Select::make('borrowing_id')
                ->label('Borrowed Book')
                ->options(function (Get $get) {

                    $query = Borrowing::with('borrowingsBook', 'borrowingsUser')
                        ->where('status', 'borrowed');

                    if ($get('user_filter')) {
                        $query->where('user_id', $get('user_filter'));
                    }

                    $borrowings = $query->get();

                    return $borrowings->mapWithKeys(function ($item) {
                        return [
                            $item->id => $item->borrowingsBook->title . ' - ' . $item->borrowingsUser->name
                        ];
                    });
                })
                ->searchable()
                ->required(),

            Textarea::make('return_condition')
                ->label('Retun Condition'),
            
            Textarea::make('notes')
                ->label('notes'),

            Hidden::make('returned_at')
                ->default(now()),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

            TextColumn::make('borrowing.borrowingsBook.title')
                ->label('Book')
                ->searchable()
                ->sortable(),

            TextColumn::make('borrowing.borrowingsUser.name')
                ->label('Borrower')
                ->searchable()
                ->sortable(),

            TextColumn::make('returned_at')
                ->label('Returned At')
                ->dateTime()
                ->sortable(),

            TextColumn::make('return_condition')
                ->label('Condition')
                ->limit(20),

            TextColumn::make('notes')
                ->label('Notes')
                ->limit(20),

            TextColumn::make('status')
                ->badge()
                ->color(fn (string $state) => match ($state) {
                    'pending' => 'warning',
                    'accepted' => 'success',
                    'rejected' => 'danger',
                }),
        ])

        ->actions([
            
            Action::make('accept')
                ->label('Accept')
                ->color('success')
                ->action(function ($record) {
                    $record->update([
                        'status' => 'accepted',
                    ]);

                    $record->borrowing->update([
                        'status' => 'returned',
                    ]);
                })
                ->visible(fn ($record) => $record->status === 'pending'),

            Action::make('reject')
                ->label('Reject')
                ->color('danger')
                ->action(function ($record) {
                    $record->update([
                        'status' => 'rejected',
                    ]);
                })
                ->visible(fn ($record) => $record->status === 'pending'),
        ])

        ->defaultSort('created_at', 'desc');
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
            'index' => ListReturns::route('/'),
            'create' => CreateReturn::route('/create'),
            'edit' => EditReturn::route('/{record}/edit'),
        ];
    }
}
