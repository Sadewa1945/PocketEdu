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
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
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
                ->required(),
            
            TextInput::make('key')  
                ->required(),
                
            Select::make('type')
                ->label('Tipe Denda')
                ->options([
                    'fixed' => 'Fix Amount (Rp)',
                    'percentage' => 'Persentage (%)',
                ])
                ->required()
                ->default('fixed'), 

            TextInput::make('value')
                ->required()
                ->numeric()
                ->label('Fine Value')
                ->helperText('Just enter a number. The unit (Rp or %) will follow the type selection above.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')
                ->label('Id')
                ->sortable(),

            TextColumn::make('key')
                ->label('Key')
                ->searchable(),

            TextColumn::make('label')
                ->label('Label')
                ->searchable(),

            TextColumn::make('value')
                ->label('Value')
                ->sortable(),

            BadgeColumn::make('type')
                    ->label('Type')
                    ->formatStateUsing(fn (string $state): string => match ($state){
                        'fixed' => 'Fixed',
                        'percentage' => 'Percentage',
                        default => $state,
                    })

        ])->actions([
                ActionGroup::make([
                EditAction::make(),
                DeleteAction::make()
                    ->modalHeading('Delete Fine Settings')
                    ->modalDescription('This action cannot be undone. Are you sure?'),
            
                ])
                ->label('More')
                ->icon('heroicon-o-ellipsis-vertical')
                ->color('gray'),
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
            'index' => ListFinesSettings::route('/'),
            'create' => CreateFinesSettings::route('/create'),
            'edit' => EditFinesSettings::route('/{record}/edit'),
        ];
    }
}
