<?php

namespace App\Filament\Widgets;

use App\Models\Borrowing;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopBooksStats extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public function getTableRecordKey(\Illuminate\Database\Eloquent\Model|array $record): string
    {
        return (string) $record->book_id;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Borrowing::query()
                    ->selectRaw('book_id, COUNT(*) as borrow_count')
                    ->groupBy('book_id')
                    ->orderByDesc('borrow_count')
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('borrowingsBook.title')
                    ->label('Book Title')
                    ->searchable()
                    ->icon('heroicon-m-book-open'),

                Tables\Columns\TextColumn::make('borrowingsBook.author')
                    ->label('Author')
                    ->icon('heroicon-m-user-circle')
                    ->color('gray'),

                Tables\Columns\TextColumn::make('borrowingsBook.category.name')
                    ->label('Category')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('borrow_count')
                    ->label('Total Borrowed')
                    ->sortable()
                    ->alignCenter()
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 20 => 'success',
                        $state >= 10 => 'warning',
                        default      => 'gray',
                    }),
            ])
            ->defaultSort('borrow_count', 'desc')
            ->paginated(false);
    }
}