<?php

namespace App\Filament\Resources\Borrowings;

use App\Filament\Resources\Borrowings\Pages\CreateBorrowing;
use App\Filament\Resources\Borrowings\Pages\EditBorrowing;
use App\Filament\Resources\Borrowings\Pages\ListBorrowings;
use App\Filament\Resources\Borrowings\Schemas\BorrowingForm;
use App\Filament\Resources\Borrowings\Tables\BorrowingsTable;
use App\Models\Borrowing;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class BorrowingResource extends Resource
{
    protected static ?string $model = Borrowing::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Transactions';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return 'Borrowings';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('user_id')
                ->label('User Borrowing')
                ->options(User::all()->pluck('name', 'id'))
                ->searchable()
                ->required(),

            Select::make('book_id')
                ->label('Book Borrowed')
                ->options(\App\Models\Book::all()->pluck('title', 'id'))
                ->searchable()
                ->required(),

            TextInput::make('quantity')
                ->label('Quantity')
                ->numeric()
                ->required(),

            TextInput::make('condition')
                ->label('Condition'),

            DateTimePicker::make('borrowed_at')
                ->label('Borrowed At')
                ->required(),

            DateTimePicker::make('returned_at')
                ->label('Returned At'),

            DatePicker::make('due_at')
                ->label('Due At'),

            Select::make('status')
                ->label('Status')
                ->options([
                    'pending' => 'Pending',
                    'borrowed' => 'Borrowed',
                    'returned' => 'Returned',
                ])
                ->required(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable(),

                TextColumn::make('book.title')
                    ->label('Book')
                    ->searchable(),

                TextColumn::make('quantity')
                    ->label('Quantity'),

                TextColumn::make('condition')
                    ->label('Condition'),

                TextColumn::make('borrowed_at')
                    ->label('Borrowed At')
                    ->dateTime(),

                TextColumn::make('returned_at')
                    ->label('Returned At')
                    ->dateTime(),

                TextColumn::make('due_at')
                    ->label('Due At')
                    ->date(),

                TextColumn::make('status')
                    ->label('Status'),
            ])

            ->actions([
            EditAction::make(),
            DeleteAction::make(),
            
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
            'index' => ListBorrowings::route('/'),
            'create' => CreateBorrowing::route('/create'),
            'edit' => EditBorrowing::route('/{record}/edit'),
        ];
    }
}
