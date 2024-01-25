<template>
    <v-sheet style="margin-top: 30px;" max-width="700" class="mx-auto">
        <h1>Create a new room</h1>
        <v-form v-on:submit.prevent="submitform">
            <v-text-field v-model="roomName" :rules="rules" label="Name"></v-text-field>
            <v-text-field v-model="roomURL" :rules="rules" label="QR-Code URL"></v-text-field>
            <v-text-field v-model="roomType" :rules="rules" label="Room Type"></v-text-field>
            <v-text-field v-model="roomSecret" :rules="rules" label="Device key / Secret"></v-text-field>
            <v-btn type="submit" block class="mt-2">Submit</v-btn>
        </v-form>
    </v-sheet>
</template>
  
<script>
export default {
    data: () => ({
        roomName: '',
        roomURL: '',
        roomType: '',
        roomSecret: '',
        rules: [
            value => value !== '' ? true : 'Field is required.',
        ],
    }),
    methods: {
        submitform() {
            const roomData = {
                name: this.roomName,
                url: this.roomURL,
                type: this.roomType,
                secret: this.roomSecret
            };
            if (this.roomName === '' || this.roomURL === '' || this.roomType === '' || this.roomSecret === '') {
                alert("Error: Please fill out all fields.")
                return;
            }

            fetch('http://localhost:3000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            })
                .then(response => {
                    this.$router.push('/');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
    },
}
</script>