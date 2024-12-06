"use client";

import { useGetTransactionsQuery } from "../lib/api";

export default function TransactionHistory() {
  const { data: transactions } = useGetTransactionsQuery();

  return (
    <div className="w-fill mt-10">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.fromCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.toCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Number(transaction.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
