import { useLayoutEffect, useState, useTransition } from "react";
import networkManager from "../network/networkManager";
//Defining a type of object what keys are to be used
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
};
type ProductTitle = {
  title: string;
};
type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
const TransitionHook = () => {
  const [count, setCount] = useState(0);
  //ProductTitle[] Here defines that this is an array of objects in the format of type casing as in type PRoductTitle at line 10
  const [products, setProducts] = useState<ProductTitle[]>([]);
  const [isPending, startTransition] = useTransition();
  const [limit, setLimit] = useState(0);

  const fetchSamplePost = async (lmt: number) => {
    try {
      const data = await networkManager.get<ProductsResponse>(
        `https://dummyjson.com/products?limit=${lmt}`
      );
      startTransition(async () => {
        const productTitleArray = data?.products?.map((product) => {
          return { title: product?.title };
        });
        setProducts(productTitleArray || []);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLimitIncrement = () => {
    setLimit((prev) => prev + 30);
  };
  useLayoutEffect(() => {
    if (limit > 0) fetchSamplePost(limit);
  }, [limit]);
  return (
    <div className="column">
      <button
        type="button"
        className="counter"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
      <button
        type="button"
        className="counter"
        onClick={handleLimitIncrement}
        
      >
        Fetch sample API
      </button>
      {isPending ? (
        <p style={{ marginTop: "1rem" }}>Loading...</p>
      ) : (
        products.length > 0 && (
          <ul style={{ marginTop: "1rem" }}>
            {products.map((product, index) => (
              <li key={index}>{product.title}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default TransitionHook;
