<?php

namespace App\Filament\Resources\Books;

use App\Filament\Resources\Books\Pages\CreateBooks;
use App\Filament\Resources\Books\Pages\EditBooks;
use App\Filament\Resources\Books\Pages\ListBooks;
use App\Models\Book;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Nette\Utils\ImageColor;
use UnitEnum;

class BooksResource extends Resource
{
    protected static ?string $model = Book::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Books';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return 'Books List';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('title')
            ->required()
            ->label('Title'),

            TextInput::make('author')
            ->required()
            ->label('Author'),

            TextInput::make('isbn')
            ->required()
            ->label('ISBN'),

            DatePicker::make('published_date')
            ->label('Published Date'),

            TextInput::make('publisher')
            ->label('Publisher'),
            
            Textarea::make('description')
            ->label('Description'),
            
            FileUpload::make('cover_image')
            ->label('Cover Image')
            ->image()
            ->directory('books')
            ->disk('public')
            ->visibility('public'),

            Select::make('category_id')
            ->relationship('category', 'name')
            ->required()
            ->label('Category'),

            Section::make('Stock Information')
            ->schema([
                Repeater::make('stock')
                    ->relationship('stock')
                    ->schema([
                        TextInput::make('total_stock')
                            ->label('Total Stock')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                if (($get('available_stock') ?? 0) == 0) {
                                    $set('available_stock', $state);
                                }
                            }),

                        TextInput::make('available_stock')
                            ->label('Available Stock')
                            ->numeric()
                            ->required()
                            ->default(0),
                    ])
                    ->columns(2)
                    ->defaultItems(1)
                    ->addable(false)
                    ->deletable(false)
                    ->reorderable(false),
            ]),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->
            columns([
                ImageColumn::make('cover_image')
                ->label('Cover')
                ->disk('public'),

                TextColumn::make('id')
                ->label('ID')
                ->sortable(),

                TextColumn::make('title')
                ->sortable()
                ->searchable(),

                TextColumn::make('author')
                ->sortable()
                ->searchable(),

                TextColumn::make('isbn')
                ->sortable()
                ->searchable(),

                TextColumn::make('publisher')
                ->sortable()
                ->searchable(),

                TextColumn::make('total_stock')
                ->label('Total Stock')
                ->sortable(),

                TextColumn::make('available_stock')
                ->label('Stock Tersedia')
                ->sortable(),

                TextColumn::make('category.name')
                ->label('Category')
                ->sortable()
                ->searchable(),

                TextColumn::make('published_date')
                ->date(),

                BadgeColumn::make('stock.status')
                    ->colors([
                        'success' => 'available',
                        'danger' => 'out_of_stock',
                    ])
                    ->label('Status'),

            ])->actions([
            EditAction::make(),
            DeleteAction::make(),
            ])
        ->filters([
                SelectFilter::make('category_id')
                    ->label('Category')
                    ->relationship('category', 'name'),
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
            'index' => ListBooks::route('/'),
            'create' => CreateBooks::route('/create'),
            'edit' => EditBooks::route('/{record}/edit'),
        ];
    }
}
