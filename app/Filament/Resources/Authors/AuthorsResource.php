<?php

namespace App\Filament\Resources\Authors;

use App\Filament\Resources\Authors\Pages\CreateAuthors;
use App\Filament\Resources\Authors\Pages\EditAuthors;
use App\Filament\Resources\Authors\Pages\ListAuthors;
use App\Filament\Resources\Authors\Schemas\AuthorsForm;
use App\Filament\Resources\Authors\Tables\AuthorsTable;
use App\Models\Author;
use App\Models\Authors;
use BackedEnum;
use Dom\Text;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class AuthorsResource extends Resource
{
    protected static ?string $model = Author::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-user-circle';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('author_name')
                ->required()
                ->label('Author Name'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')
                ->label('Id')
                ->sortable(),

            TextColumn::make('author_name')
                ->label('Author Name')
                ->sortable()
                ->searchable(),
        ])->actions([
                EditAction::make(),
                DeleteAction::make()
                    ->modalHeading('Delete Author')
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
            'index' => ListAuthors::route('/'),
            'create' => CreateAuthors::route('/create'),
            'edit' => EditAuthors::route('/{record}/edit'),
        ];
    }
}
