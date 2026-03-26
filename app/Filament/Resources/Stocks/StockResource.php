<?php

namespace App\Filament\Resources\Stocks;

use App\Filament\Resources\Stocks\Pages\CreateStock;
use App\Filament\Resources\Stocks\Pages\EditStock;
use App\Filament\Resources\Stocks\Pages\ListStocks;
use App\Filament\Resources\Stocks\Schemas\StockForm;
use App\Filament\Resources\Stocks\Tables\StocksTable;
use App\Models\Stock;
use BackedEnum;
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

class StockResource extends Resource
{
    protected static ?string $model = Stock::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-rectangle-stack';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 3;

    public static function getNavigationLabel(): string
    {
        return 'Books Stock';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('book_id')
                ->label('Book')
                ->relationship('book', 'title')
                ->required(),

            TextInput::make('total_stock')
                ->label('Total Stock')
                ->numeric()
                ->required(),

            TextInput::make('available_stock')
                ->label('Available Stock')
                ->numeric()
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID'),
                
                TextColumn::make('book.title')
                    ->label('Book Title')
                    ->searchable(),
                    
                TextColumn::make('total_stock')
                    ->label('Total Stock'),

                TextColumn::make('available_stock')
                    ->label('Available Stock'),
                
                BadgeColumn::make('status')
                    ->label('Status')
                    ->formatStateUsing(fn (string $state): string => match ($state){
                        'available' => 'Available',
                        'out_of_stock' => 'Out of Stock',
                        default => $state,
                    })
                    ->colors([
                        'success' => 'available',
                        'danger' => 'out_of_stock',
                    ]),
                
            ])->actions([
                EditAction::make(),
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
            'index' => ListStocks::route('/'),
            'create' => CreateStock::route('/create'),
            'edit' => EditStock::route('/{record}/edit'),
        ];
    }
    
}
