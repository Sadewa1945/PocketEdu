<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
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
            FileUpload::make('image')
            ->label('Photo Profile')
            ->image()
            ->directory('profile')
            ->disk('public')
            ->maxSize(2048)
            ->helperText('Upload profile photo (Max. 2MB)'),

            TextInput::make('name')
            ->required()
            ->minLength(4)
            ->label('Name'),

            TextInput::make('email')
            ->unique()
            ->required()
            ->email()
            ->label('Email'),

            TextInput::make('phone')
            ->required()
            ->minLength(10)
            ->label('Phone')
            ->numeric(),

            Select::make('role')
            ->options([
                'admin' => 'Admin',
                'member' => 'Member',
            ])
            ->default('member')
            ->required()
            ->label('Role'),

            TextInput::make('password')
            ->required(fn(string $context) => $context === 'create')
            ->dehydrated(fn ($state) => filled($state))
            ->dehydrateStateUsing(fn ($state) => bcrypt($state))
            ->label('Password')
            ->password()
            ->minLength(8),
        ]);
    }

    public static function table(Table $table): Table
    {
      return $table
        ->columns([
            ImageColumn::make('image')
            ->label('Image')
            ->disk('public'),

            TextColumn::make('name')
            ->label('Name')
            ->searchable(),

            TextColumn::make('email')
            ->label('Email')
            ->searchable(),

            TextColumn::make('phone')
            ->label('Phone')
            ->searchable(),

            TextColumn::make('role')
            ->label('Role'),

            TextColumn::make('created_at')
            ->label('Created At')
            ->dateTime(),
        ])
        ->actions([
            EditAction::make(),
            DeleteAction::make()
                ->modalHeading('Delete User')
                ->modalDescription('This action cannot be undone. Are you sure?'),
            
        ])
        ->filters([
            SelectFilter::make('role')
                ->options([
                    'admin' => 'Admin',
                    'member' => 'Member',
                ])
                ->label('Role'),
        ])
        ->headerActions([
            ExportAction::make()->label('Export Excel'),
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
