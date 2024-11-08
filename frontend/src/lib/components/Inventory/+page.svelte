<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Button from "../ui/button/button.svelte";

    const userEmail=$page.data.session?.user?.email

    let name = "";
    let category = "";
    let expiryDate = "";
    let status = "";
    let description = "";
    let price = "";

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
            // Optionally, redirect or update the UI
            // goto("/inventory");
        } else {
            console.error("Failed to add item");
        }
    }
</script>

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
