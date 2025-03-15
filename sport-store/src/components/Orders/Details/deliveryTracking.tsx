"use client";
import { Loader2 } from "lucide-react";
import { OrderStatus, orderStatusInfo } from "./orderDetails00";

interface DeliveryTrackingProps {
  status: OrderStatus;
  onChangeStatus: () => void;
  isLoading: boolean;
}

export default function DeliveryTracking({ status, onChangeStatus, isLoading }: DeliveryTrackingProps) {
  const steps = Object.values(OrderStatus);
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Theo Dõi Đơn Hàng</h3>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 h-1 bg-gray-200 w-full"></div>
        
        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const stepInfo = orderStatusInfo[step as keyof typeof orderStatusInfo];
            const StepIcon = stepInfo.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={`${step}-${index}`}
                className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'scale-105' : ''} w-1/4`}
              >
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full 
                  ${isActive ? stepInfo.bgColor : 'bg-gray-100'} 
                  ${isActive ? stepInfo.borderColor : 'border-gray-200'} 
                  ${isActive ? 'border-2' : 'border'}`}>
                  <StepIcon className={`w-5 h-5 ${isActive ? stepInfo.color : 'text-gray-400'}`} />
                </div>

                {/* Label */}
                <div className={`mt-3 text-center ${isActive ? '' : 'opacity-60'}`}>
                  <h4 className={`font-medium ${isActive ? stepInfo.color : 'text-gray-500'}`}>{step}</h4>
                  <p className="text-xs text-gray-600 mt-1">{stepInfo.description}</p>
                  {isActive && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-800">{stepInfo.date}</p>
                      <p className="text-xs text-gray-500">{stepInfo.time}</p>
                    </div>
                  )}
                </div>

                {/* Button */}
                {isCurrent && stepInfo.nextStatus && (
                  <button
                    onClick={onChangeStatus}
                    disabled={isLoading}
                    className={`mt-4 px-3 py-1 text-xs text-white font-medium rounded-md 
                      ${stepInfo.buttonColor}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        {stepInfo.buttonText}
                        <svg className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}