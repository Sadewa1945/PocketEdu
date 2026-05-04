<?php

namespace App\Filament\Resources\BukuMasuks\Pages;

use App\Filament\Resources\BukuMasuks\BukuMasukResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBukuMasuks extends ListRecords
{
    protected static string $resource = BukuMasukResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
