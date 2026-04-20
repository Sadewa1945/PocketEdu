<?php

namespace App\Filament\Resources\Fines\Pages;

use App\Filament\Resources\Fines\FineResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateFine extends CreateRecord
{
    protected static string $resource = FineResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Fine Data')
            ->modalDescription('Are you sure you want to create this fine? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}
