<?php

namespace App\DataTransferObjects\Subscription;

final readonly class PlanChangeData
{
    public function __construct(
        public string $newPriceId,
        public ?string $subscriptionName = 'default',
        public ?bool $prorate = true,
        public ?bool $invoiceNow = false,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            newPriceId: $data['new_price_id'],
            subscriptionName: $data['subscription_name'] ?? 'default',
            prorate: $data['prorate'] ?? true,
            invoiceNow: $data['invoice_now'] ?? false,
        );
    }

    public function toArray(): array
    {
        return [
            'new_price_id' => $this->newPriceId,
            'subscription_name' => $this->subscriptionName,
            'prorate' => $this->prorate,
            'invoice_now' => $this->invoiceNow,
        ];
    }
}
