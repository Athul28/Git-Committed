<script>
    import { page } from "$app/stores";
    const user=$page.data.session?.user;
</script>

<nav class="border border-black w-full  ">
    <p>MedFlow</p>
    <div>
        {user?.name}
    </div>
</nav>