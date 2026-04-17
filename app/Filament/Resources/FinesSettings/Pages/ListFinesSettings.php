<?php

namespace App\Filament\Resources\FinesSettings\Pages;

use App\Filament\Resources\FinesSettings\FinesSettingsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFinesSettings extends ListRecords
{
    protected static string $resource = FinesSettingsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
