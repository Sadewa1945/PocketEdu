<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
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

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-users';
   
    protected static string|UnitEnum|null $navigationGroup = 'Users';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return 'User List';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
            ->required()
            ->label('Name'),

            TextInput::make('username')
            ->unique()
            ->required()
            ->label('Username'),

            Select::make('role')
            ->options([
                'admin' => 'Admin',
                'user' => 'User',
            ])
            ->required()
            ->label('Role'),

            Select::make('class_id')
            ->label('Class')
            ->relationship('classes', 'grade')
            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->grade} {$record->major->name} {$record->class_section}")
            ->required(),

            TextInput::make('password')
            ->required()
            ->label('Password')
            ->password(),
        ]);
    }

    public static function table(Table $table): Table
    {
      return $table
        ->columns([
            TextColumn::make('name')
            ->label('Name')
            ->searchable(),

            TextColumn::make('username')
            ->label('Username')
            ->searchable(),

            TextColumn::make('role')
            ->label('Role'),

            TextColumn::make('classes.grade')
            ->label('Class'),

            TextColumn::make('classes.major.name')
            ->label('Major'),

            TextColumn::make('classes.class_section')
            ->label('Class Section'),

            TextColumn::make('created_at')
            ->label('Created At')
            ->dateTime(),
        ])
        ->actions([
            EditAction::make(),
            DeleteAction::make(),
        ])
        ->filters([
            SelectFilter::make('class')
                ->label('Class')
                ->relationship('classes', 'grade'),
            
            SelectFilter::make('major')
                ->label('Major')
                ->relationship('classes.major', 'name'),

            SelectFilter::make('class_section')
                ->label('Class Section')
                ->relationship('classes', 'class_section'),

            SelectFilter::make('role')
                ->options([
                    'admin' => 'Admin',
                    'user' => 'User',
                ])
                ->label('Role'),
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
