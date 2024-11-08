<script>
    import { page } from "$app/stores";
    const user=$page.data.session?.user;
</script>
<style>
    .name{
        background-color: #e83e88;
        height: 60px;
        color:white;
        text-align: center;
        text-indent: 5px;
        font-size: 40px;
        font-weight: bold;
    }
    .profile{
        border-radius: 30px;
        border-color: black;
        border-width: 2px;
        margin-right:8px;
        margin-bottom: 5px;
        margin-top: 5px;
    }
</style>
<nav class="border border-black w-full  ">
    <nav class="name flex justify-between">
        <p>MedFlow</p>
        <img src={user?.image} alt='profile' class="profile"/>
    </nav>
    
</nav>
