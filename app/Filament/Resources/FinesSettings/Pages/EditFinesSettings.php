<?php

namespace App\Filament\Resources\FinesSettings\Pages;

use App\Filament\Resources\FinesSettings\FinesSettingsResource;
use Filament\Actions\Action;
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

    protected function getSaveFormAction(): Action
    {
        return Action::make('save')
            ->label('Save Changes') 
            ->requiresConfirmation()
            ->modalHeading('Confirm Changes')
            ->modalDescription('Are you sure you want to update this fine setting data?')
            ->modalSubmitActionLabel('Yes, Update Data')
            ->modalIcon('heroicon-o-exclamation-triangle')
            ->modalIconColor('warning')
            ->color('primary')
            ->action(fn () => $this->save());
    }
}
