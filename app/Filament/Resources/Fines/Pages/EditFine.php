<?php

namespace App\Filament\Resources\Fines\Pages;

use App\Filament\Resources\Fines\FineResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFine extends EditRecord
{
    protected static string $resource = FineResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
