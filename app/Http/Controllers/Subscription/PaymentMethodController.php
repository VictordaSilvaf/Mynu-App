<?php

namespace App\Http\Controllers\Subscription;

use App\DataTransferObjects\Subscription\PaymentMethodData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\UpdatePaymentMethodRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    /**
     * Display payment methods page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('subscription/payment-methods', [
            'intent' => $user->createSetupIntent(),
            'payment_methods' => $user->paymentMethods(),
            'default_payment_method' => $user->defaultPaymentMethod(),
        ]);
    }

    /**
     * Update payment method.
     */
    public function update(UpdatePaymentMethodRequest $request): JsonResponse
    {
        try {
            $paymentMethodData = PaymentMethodData::fromRequest($request->validated());

            $this->subscriptionService->updatePaymentMethod(
                $request->user(),
                $paymentMethodData
            );

            return response()->json([
                'message' => 'Método de pagamento atualizado com sucesso!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete payment method.
     */
    public function destroy(Request $request, string $paymentMethodId): JsonResponse
    {
        try {
            $user = $request->user();

            $paymentMethod = $user->findPaymentMethod($paymentMethodId);

            if (! $paymentMethod) {
                return response()->json([
                    'message' => 'Método de pagamento não encontrado.',
                ], 404);
            }

            $paymentMethod->delete();

            return response()->json([
                'message' => 'Método de pagamento removido com sucesso!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
