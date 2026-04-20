<?php

namespace App\Filament\Resources\Returns\Pages;

use App\Filament\Resources\Returns\ReturnResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateReturn extends CreateRecord
{
    protected static string $resource = ReturnResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Return Data')
            ->modalDescription('Are you sure you want to create this return? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}
