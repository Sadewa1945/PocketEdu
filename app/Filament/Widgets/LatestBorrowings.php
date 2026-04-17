<?php

namespace App\Filament\Widgets;

use App\Models\Borrowing;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestBorrowings extends BaseWidget
{
    protected static ?int $sort = 4;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Borrowing::query()->latest('borrowed_at')->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('borrowingsUser.name')
                    ->label('User')
                    ->searchable()
                    ->icon('heroicon-m-user'),

                Tables\Columns\TextColumn::make('borrowingsBook.title')
                    ->label('Book Title')
                    ->limit(30)
                    ->searchable()
                    ->icon('heroicon-m-book-open'),

                Tables\Columns\TextColumn::make('borrowed_at')
                    ->label('Borrowed At')
                    ->date('d M Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('due_at')
                    ->label('Due Date')
                    ->date('d M Y')
                    ->sortable()
                    ->color(fn ($record) => $record->due_at < now() && $record->status !== 'returned' ? 'danger' : null),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->color(fn (string $state): string => match ($state) {
                        'borrowed' => 'warning',
                        'returned' => 'success',
                        'overdue'  => 'danger',
                        default    => 'gray',
                    }),
            ])
            ->defaultSort('borrowed_at', 'desc')
            ->paginated(false);
    }
}