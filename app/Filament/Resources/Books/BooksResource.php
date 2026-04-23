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
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
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

            TextInput::make('book_price')
                ->label('Book Price')
                ->required()
                ->numeric()
                ->prefix('Rp'),

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
                ->default('pocketedu.png')
                ->disk('public')
                ->visibility('public')
                ->maxSize(2048)
                ->helperText('Upload profile photo (Max. 2MB)'),

            Select::make('bookshelf_id')
                ->relationship('bookshelf', 'name')
                ->required()
                ->label('Bookshelf'),
            
            Select::make('genres')
                ->relationship('genres', 'name') 
                ->multiple() 
                ->preload()
                ->searchable()
                ->required(),

            TextInput::make('stock')
                ->label('Stock')
                ->numeric()

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->
            columns([
                TextColumn::make('id')
                    ->label('Id')
                    ->sortable(),

                ImageColumn::make('cover_image')
                    ->defaultImageUrl(url ('/images/pocketedu.png'))
                    ->label('Cover')
                    ->disk('public'),

                TextColumn::make('title')
                    ->label('Book Title')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('bookshelf.name')
                    ->label('Bookshelf')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('author')
                    ->label('Author')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('isbn')
                    ->label('ISBN')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('publisher')
                    ->label('Publisher')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('book_price')
                    ->label('Price')
                    ->money('IDR', locale: 'id')
                    ->sortable(),

                TextColumn::make('stock')
                    ->label('Stock'),

                TextColumn::make('published_date')
                    ->label('Published Date')
                    ->date(),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(fn (Book $record): string => $record->stock > 0 ? 'Available' : 'Out of Stock')
                    ->colors([
                        'success' => 'Available',
                        'danger' => 'Out of Stock' 
                    ])

            ])->actions([
                EditAction::make(),
                DeleteAction::make()
                    ->modalHeading('Delete Book')
                    ->modalDescription('This action cannot be undone. Are you sure?'),
                ])
            ->filters([
                    SelectFilter::make('bookshelf_id')
                        ->label('Bookshelf')
                        ->relationship('bookshelf', 'name'),
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
            'index' => ListBooks::route('/'),
            'create' => CreateBooks::route('/create'),
            'edit' => EditBooks::route('/{record}/edit'),
        ];
    }
}
