<?php

namespace App\Filament\Resources\Borrowings;

use App\Filament\Resources\Borrowings\Pages\CreateBorrowing;
use App\Filament\Resources\Borrowings\Pages\EditBorrowing;
use App\Filament\Resources\Borrowings\Pages\ListBorrowings;
use App\Filament\Resources\Borrowings\Schemas\BorrowingForm;
use App\Filament\Resources\Borrowings\Tables\BorrowingsTable;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class BorrowingResource extends Resource
{
    protected static ?string $model = Borrowing::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Transactions';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return 'Borrowings';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('user_id')
                ->label('User Borrowing')
                ->options(User::all()->pluck('name', 'id'))
                ->searchable()
                ->required(),

            Select::make('book_id')
                ->label('Book Borrowed')
                ->options(Book::all()->pluck('title', 'id'))
                ->searchable()
                ->required(),

            TextInput::make('quantity')
                ->label('Quantity')
                ->numeric()
                ->default(1)
                ->required(),

            DatePicker::make('borrowed_at')
                ->label('Borrowed At'),

            DatePicker::make('due_at')
                ->label('Due At')
                ->required(),

            Textarea::make('notes')
                ->label('Notes'),

            Select::make('status')
                ->options(function ($record) {

                    if ($record?->status === 'returned') {
                        return [
                            'returned' => 'Returned',
                        ];
                    }

                    return [
                        'pending' => 'Pending',
                        'prepared' => 'Prepared',
                        'ready_to_pickup' => 'Ready to Pickup',
                        'borrowed' => 'Borrowed',
                    ];
                })
                ->disabled(fn ($record) => $record?->status === 'returned')
                ->required(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('borrowingsUser.name')
                    ->label('User')
                    ->searchable(),

                TextColumn::make('borrowingsBook.title')
                    ->label('Book')
                    ->searchable(),

                TextColumn::make('quantity')
                    ->label('Quantity'),

                TextColumn::make('borrowed_at')
                    ->label('Borrowed At')
                    ->dateTime(),

                TextColumn::make('due_at')
                    ->label('Due At')
                    ->dateTime(),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->formatStateUsing(fn (string $state): string => match ($state){
                        'pending' => 'Pending',
                        'borrowed' => 'Borrowed',
                        'prepared' => 'Prepared',
                        'ready_to_pickup' => 'Ready to Pickup',
                        'overdue' => 'Overdue',
                        'returned' => 'Returned',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'pending', 'prepared', 'ready_to_pickup' => 'warning',
                        'borrowed' => 'primary',
                        'overdue' => 'danger',
                        'returned' => 'gray',
                        default => 'gray',
                    })
            ])

            ->actions([
                ActionGroup::make([
                    
                   Action::make('changeStatus')
                    ->label('Change Status')
                    ->icon('heroicon-o-adjustments-horizontal')
                    ->color('success')
                    ->visible(fn ($record) => $record->status !== 'returned')
                    ->form([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'prepared' => 'Prepared',
                                'ready_to_pickup' => 'Ready to Pickup',
                                'borrowed' => 'Borrowed',
                                'overdue' => 'Overdue',
                            ])
                            ->required(),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => $data['status'],
                        ]);
                    }),

                    EditAction::make(),

                    DeleteAction::make(),
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
            'index' => ListBorrowings::route('/'),
            'create' => CreateBorrowing::route('/create'),
            'edit' => EditBorrowing::route('/{record}/edit'),
        ];
    }
}
