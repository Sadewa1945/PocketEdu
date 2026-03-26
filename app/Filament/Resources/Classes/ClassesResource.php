<?php

namespace App\Filament\Resources\Classes;

use App\Filament\Resources\Classes\Pages\CreateClasses;
use App\Filament\Resources\Classes\Pages\EditClasses;
use App\Filament\Resources\Classes\Pages\ListClasses;
use App\Models\Classes;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class ClassesResource extends Resource
{
    protected static ?string $model = Classes::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-user-group';
   
    protected static string|UnitEnum|null $navigationGroup = 'Users';

    protected static ?int $navigationSort = 4;

    public static function getNavigationLabel(): string
    {
        return 'Class List';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('grade')
            ->unique()
            ->required()
            ->label('Class Grade'),

            Select::make('major_id')
            ->label('Major')
            ->relationship('major', 'name')
            ->required(),

            TextInput::make('class_section')
            ->unique()
            ->required()
            ->label('Class Section'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                TextColumn::make('grade')
                    ->label('Class Grade')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('major.name')
                    ->label('Major Name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('class_section')
                    ->label('Class Section')
                    ->sortable(),
            ])
            ->actions([
            EditAction::make(),
            DeleteAction::make(),
            ])
            ->filters([
            SelectFilter::make('class_section')
                ->label('Class Section')
                ->options(
                    Classes::query()
                        ->select('class_section')
                        ->distinct()
                        ->pluck('class_section', 'class_section')
                        ->toArray()
                ),
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
            'index' => ListClasses::route('/'),
            'create' => CreateClasses::route('/create'),
            'edit' => EditClasses::route('/{record}/edit'),
        ];
    }
}
