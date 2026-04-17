<?php

namespace App\Filament\Resources\FinesSettings;

use App\Filament\Resources\FinesSettings\Pages\CreateFinesSettings;
use App\Filament\Resources\FinesSettings\Pages\EditFinesSettings;
use App\Filament\Resources\FinesSettings\Pages\ListFinesSettings;
use App\Filament\Resources\FinesSettings\Schemas\FinesSettingsForm;
use App\Filament\Resources\FinesSettings\Tables\FinesSettingsTable;
use App\Models\FinesSettings;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class FinesSettingsResource extends Resource
{
    protected static ?string $model = FinesSettings::class;

     protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string|UnitEnum|null $navigationGroup = 'System';

    protected static ?int $navigationSort = 999;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('label')
                ->disabled()
                ->required()
                ->columnSpanFull(),
                
            TextInput::make('value')
                ->label('Nominal (Rp)')
                ->numeric()
                ->required()
                ->prefix('Rp')
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')
                ->label('Id')
                ->sortable(),
            TextColumn::make('label')
                ->searchable(),
            TextColumn::make('value')
                ->money('idr')
                ->sortable(),
        ])->actions([
                    ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ])
                ->label('More')
                ->icon('heroicon-o-ellipsis-vertical')
                ->color('gray'),
            ]);;
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
            'index' => ListFinesSettings::route('/'),
            'create' => CreateFinesSettings::route('/create'),
            'edit' => EditFinesSettings::route('/{record}/edit'),
        ];
    }
}
