<?php

namespace App\Filament\Resources\BukuMasuks;

use App\Filament\Resources\BukuMasuks\Pages\CreateBukuMasuk;
use App\Filament\Resources\BukuMasuks\Pages\EditBukuMasuk;
use App\Filament\Resources\BukuMasuks\Pages\ListBukuMasuks;
use App\Filament\Resources\BukuMasuks\Schemas\BukuMasukForm;
use App\Filament\Resources\BukuMasuks\Tables\BukuMasuksTable;
use App\Models\BukuMasuk;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class BukuMasukResource extends Resource
{
    protected static ?string $model = BukuMasuk::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 4;

    public static function getNavigationLabel(): string
    {
        return 'Guestbook';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('book_id')
                ->relationship('books', 'title')
                ->required()
                ->label('Book'),

            TextInput::make('book_price')
                ->numeric()
                ->required()
                ->label('Book Price')
                ->prefix('Rp'),

            TextInput::make('stock')
                ->numeric()
                ->required()
                ->label('Stock'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')
                ->label('Id')
                ->sortable(),

            TextColumn::make('books.title')
                ->label('Book')
                ->sortable()
                ->searchable(),

            TextColumn::make('book_price')
                ->label('Book Price')
                ->money('IDR', locale: 'id'),
            
            TextColumn::make('stock')
                ->label('Stock'),

        ])->actions([
            EditAction::make(),
            DeleteAction::make()
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
            'index' => ListBukuMasuks::route('/'),
            'create' => CreateBukuMasuk::route('/create'),
            'edit' => EditBukuMasuk::route('/{record}/edit'),
        ];
    }
}
