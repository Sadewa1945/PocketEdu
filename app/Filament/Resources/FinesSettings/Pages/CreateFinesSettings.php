<?php

namespace App\Filament\Resources\FinesSettings\Pages;

use App\Filament\Resources\FinesSettings\FinesSettingsResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateFinesSettings extends CreateRecord
{
    protected static string $resource = FinesSettingsResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Fine Setting Data')
            ->modalDescription('Are you sure you want to create this fine setting? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}
