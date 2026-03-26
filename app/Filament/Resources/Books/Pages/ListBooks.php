<?php

namespace App\Filament\Resources\Books\Pages;

use App\Filament\Resources\Books\BooksResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBooks extends ListRecords
{
    protected static string $resource = BooksResource::class;

    protected static ?string $title = 'Books List';

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
