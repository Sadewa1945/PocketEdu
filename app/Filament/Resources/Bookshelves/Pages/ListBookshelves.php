<?php

namespace App\Filament\Resources\Bookshelves\Pages;

use App\Filament\Resources\Bookshelves\BookshelfResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBookshelves extends ListRecords
{
    protected static string $resource = BookshelfResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
