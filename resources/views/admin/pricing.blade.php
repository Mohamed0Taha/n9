<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pricing Configuration - n8n Replica Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <a href="/admin" class="text-xl font-bold text-indigo-600">n8n Replica Admin</a>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="text-gray-500 mr-4">Pricing Configuration</span>
                        <a href="/admin" class="text-sm font-medium text-gray-500 hover:text-gray-700">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
            </div>

            <div class="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Key
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Credit Cost
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Active
                            </th>
                            <th scope="col" class="relative px-6 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($pricing as $config)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ $config->name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $config->key }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ number_format($config->credit_cost, 2) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $config->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                    {{ $config->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onclick="openEditModal({{ json_encode($config) }})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                <button onclick="toggleActive('{{ $config->id }}')" class="text-gray-600 hover:text-gray-900">Toggle Status</button>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Pricing</h3>
            <form id="editPricingForm" onsubmit="submitPricing(event)">
                <input type="hidden" id="modalPricingId" name="pricing_id">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2">
                </div>
                <div class="mb-4">
                    <label for="credit_cost" class="block text-sm font-medium text-gray-700">Credit Cost</label>
                    <input type="number" name="credit_cost" id="credit_cost" step="0.01" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2">
                </div>
                <div class="flex justify-end">
                    <button type="button" onclick="closeEditModal()" class="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(config) {
            document.getElementById('modalPricingId').value = config.id;
            document.getElementById('name').value = config.name;
            document.getElementById('credit_cost').value = config.credit_cost;
            document.getElementById('editModal').classList.remove('hidden');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.add('hidden');
        }

        async function submitPricing(e) {
            e.preventDefault();
            const id = document.getElementById('modalPricingId').value;
            const name = document.getElementById('name').value;
            const credit_cost = document.getElementById('credit_cost').value;
            
            try {
                const response = await fetch(`/admin/pricing/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ name, credit_cost })
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to update pricing');
                }
            } catch (error) {
                console.error(error);
                alert('Error updating pricing');
            }
        }

        async function toggleActive(id) {
            if (!confirm('Are you sure you want to toggle this status?')) return;
            
            try {
                const response = await fetch(`/admin/pricing/${id}/toggle`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to toggle status');
                }
            } catch (error) {
                console.error(error);
                alert('Error toggling status');
            }
        }
    </script>
</body>
</html>
