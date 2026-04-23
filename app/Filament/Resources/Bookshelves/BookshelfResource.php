<?php

namespace App\Filament\Resources\Bookshelves;

use App\Filament\Resources\Bookshelves\Pages\CreateBookshelf;
use App\Filament\Resources\Bookshelves\Pages\EditBookshelf;
use App\Filament\Resources\Bookshelves\Pages\ListBookshelves;
use App\Filament\Resources\Bookshelves\Schemas\BookshelfForm;
use App\Filament\Resources\Bookshelves\Tables\BookshelvesTable;
use App\Models\Bookshelf;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class BookshelfResource extends Resource
{
    protected static ?string $model = Bookshelf::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-tag';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->label('Bookshelf Name')
                ->unique()
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')
                ->label('ID')
                ->sortable(),

            TextColumn::make('name')
                ->label('Bookshelf Name')
                ->searchable()
                ->sortable(),

        ])->actions([
            EditAction::make(),
            DeleteAction::make()
                ->modalHeading('Delete Bookshelf')
                ->modalDescription('This action cannot be undone. Are you sure?'),
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
            'index' => ListBookshelves::route('/'),
            'create' => CreateBookshelf::route('/create'),
            'edit' => EditBookshelf::route('/{record}/edit'),
        ];
    }
}
