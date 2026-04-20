<?php

namespace App\Filament\Resources\Categories;

use App\Filament\Resources\Categories\Pages\CreateCategories;
use App\Filament\Resources\Categories\Pages\EditCategories;
use App\Filament\Resources\Categories\Pages\ListCategories;
use App\Models\Category;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class CategoriesResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-tag';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
            ->unique()
            ->required()
            ->label('Category Name'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Category Name')
                    ->searchable()
                    ->sortable(),
            ])
            ->actions([
            EditAction::make(),
            DeleteAction::make()
                ->modalHeading('Delete Book')
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
            'index' => ListCategories::route('/'),
            'create' => CreateCategories::route('/create'),
            'edit' => EditCategories::route('/{record}/edit'),
        ];
    }
}
