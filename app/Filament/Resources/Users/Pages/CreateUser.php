<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create User Data')
            ->modalDescription('Are you sure you want to create this User? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}
