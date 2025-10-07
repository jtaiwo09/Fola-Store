import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CartItemQuantityProps {
  quantity: number;
  unitOfMeasure?: string;
  minimumOrder?: number;
  maximumOrder?: number;
  onQuantityChange: (change: number) => void;
}

const CartItemQuantity = ({
  quantity,
  unitOfMeasure,
  minimumOrder = 1,
  maximumOrder,
  onQuantityChange,
}: CartItemQuantityProps) => {
  // Define min and max based on product rules
  const minQuantity = minimumOrder && minimumOrder > 0 ? minimumOrder : 1;
  const maxQuantity = maximumOrder || Infinity;

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(-1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className="h-9 w-9 rounded-r-none"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-16 text-center text-sm">
        {quantity} {unitOfMeasure && `${unitOfMeasure}s`}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="h-9 w-9 rounded-l-none"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CartItemQuantity;
