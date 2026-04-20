<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoriesResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateCategories extends CreateRecord
{
    protected static string $resource = CategoriesResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Categories Data')
            ->modalDescription('Are you sure you want to create this categories? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}
