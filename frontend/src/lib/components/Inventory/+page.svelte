<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Button from "../ui/button/button.svelte";

    let items: { name: string, category: string, expiryDate: string, status: string, description: string, price: number }[] = [];

    const userEmail=$page.data.session?.user?.email

    let name = "";
    let category = "";
    let expiryDate = "";
    let status = "";
    let description = "";
    let price = "";

    onMount(()=>{
        getInventoryItem();
    })

    async function addItem() {
        const response = await fetch("/api/addItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                category,
                expiryDate,
                status,
                description,
                price,
                userEmail
            })
        });

        if (response.ok) {
            const newItem = await response.json();
            console.log("Item added:", newItem);
            goto('/inventory')
            // Optionally, redirect or update the UI
            // goto("/inventory");
        } else {
            console.error("Failed to add item");
        }
    }

    const getInventoryItem = async () => {
    try {
        const res = await fetch(`/api/getInventory?email=${userEmail}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        items=data.items;
        console.log(data.items);
    } catch (error) {
        console.error("Error fetching inventory item:", error);
    }
};

</script>


<table class="min-w-full bg-white border border-gray-200">
    <thead>
        <tr class="w-full bg-gray-100 border-b">
            <th class="py-2 px-4 text-left">Name</th>
            <th class="py-2 px-4 text-left">Category</th>
            <th class="py-2 px-4 text-left">Expiry Date</th>
            <th class="py-2 px-4 text-left">Price</th>
            <th class="py-2 px-4 text-left">Status</th>
        </tr>
    </thead>
    <tbody>
        {#each items as item}
        <tr class="border-b hover:bg-gray-50">
            <td class="py-2 px-4">{item.name}</td>
            <td class="py-2 px-4">{item.category}</td>
            <td class="py-2 px-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
            <td class="py-2 px-4">{item.price}</td>
            <td class="py-2 px-4" style="color: {item.status === 'Available' ? 'green' : 'red'}">{item.status}</td>
        </tr>
        {/each}
    </tbody>
</table>

<form on:submit|preventDefault={addItem}>
    <label>
        Name:
        <input type="text" bind:value={name} required />
    </label>
    <br>
    <label>
        Category:
        <select bind:value={category} required>
            <option value="" disabled selected>Select a category</option>
            <option value="Disinfectants">Disinfectants</option>
            <option value="PPE">PPE</option>
            <option value="Medical_Devices">Medical Devices</option>
            <option value="Medications">Medications</option>
            <option value="Other">Other</option>
        </select>
    </label>
    <br>
    <label>
        Expiry Date:
        <input type="date" bind:value={expiryDate} required />
    </label>
    <label>
        Status:
        <select bind:value={status} required>
            <option value="" disabled selected>Select status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
        </select>
    </label>
    <br>
    <label>
        Description:
        <textarea bind:value={description} required></textarea>
    </label>
    <br>
    <label>
        Price:
        <input type="number" bind:value={price} required />
    </label>
    <br>
    <Button type="submit">Add Item</Button>
</form>
