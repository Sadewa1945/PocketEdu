<?php

namespace App\Filament\Resources\BukuMasuks\Pages;

use App\Filament\Resources\BukuMasuks\BukuMasukResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBukuMasuk extends EditRecord
{
    protected static string $resource = BukuMasukResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
