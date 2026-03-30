<?php

namespace App\Filament\Resources\Majors;

use App\Filament\Resources\Majors\Pages\CreateMajor;
use App\Filament\Resources\Majors\Pages\EditMajor;
use App\Filament\Resources\Majors\Pages\ListMajors;
use App\Models\Major;
use BackedEnum;
use Dom\Text;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class MajorResource extends Resource
{
    protected static ?string $model = Major::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';
   
    protected static string|UnitEnum|null $navigationGroup = 'Users';

    protected static ?int $navigationSort = 3;

    public static function getNavigationLabel(): string
    {
        return 'Major List';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
            ->required()
            ->label('Major Name'),

            TextInput::make('code')
            ->required()
            ->label('Major Code'),
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
            ->label('Major Name')
            ->searchable()
            ->sortable(),

            TextColumn::make('code')
            ->label('Major Code')
            ->searchable()
            ->sortable(),

        ])->actions([
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
            'index' => ListMajors::route('/'),
            'create' => CreateMajor::route('/create'),
            'edit' => EditMajor::route('/{record}/edit'),
        ];
    }
}
