<?php

namespace App\Filament\Resources\FinesSettings\Pages;

use App\Filament\Resources\FinesSettings\FinesSettingsResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFinesSettings extends EditRecord
{
    protected static string $resource = FinesSettingsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
