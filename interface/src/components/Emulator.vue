<template>
  <v-card>
    <v-card-title><h3>Emulator</h3></v-card-title>
    <v-card-text>
      <p>version: {{ globalHeader.version }}; identifier: {{ globalHeader.identifier }}; sleepTime: {{ globalHeader.sleepTime }}s (~{{ Math.round(globalHeader.sleepTime/60) }}min)</p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="image-container">
      <img :src="imgSrc" />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="fetchAndDecode">Refresh</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
  
  <script>
  export default {
    props: ['url'],
    data() {
      return {
        imgSrc: '',
        globalHeader: {
          version: 0,
          identifier: 0,
          sleepTime: 0,
        },
        SCREEN_WIDTH: 960,
        SCREEN_HEIGHT: 540,
      };
    },
    methods: {
      readGlobalHeader(dataView, offset) {
        const version = dataView.getUint8(offset);
        const identifier = dataView.getUint32(offset + 1, true);
        const sleepTime = dataView.getUint32(offset + 5, true);
        return { version, identifier, sleepTime, newOffset: offset + 9 };
      },
      readImageDimension(dataView, offset) {
        if (offset + 8 > dataView.byteLength) {
          return null;
        }
        const x = dataView.getUint16(offset, true);
        const y = dataView.getUint16(offset + 2, true);
        const width = dataView.getUint16(offset + 4, true);
        const height = dataView.getUint16(offset + 6, true);
        return { x, y, width, height, newOffset: offset + 8 };
      },
      async fetchAndDecode() {
        const response = await fetch(this.url);
        const arrayBuffer = await response.arrayBuffer();
        const dataView = new DataView(arrayBuffer);
  
        let offset = 0;
        const header = this.readGlobalHeader(dataView, offset);
        this.globalHeader = header;
        offset = header.newOffset;
        console.log(`Read file with schema version ${header.version}, identifier: ${header.identifier} and sleep time: ${header.sleepTime}s`);
  
        const canvas = document.createElement('canvas');
        canvas.width = this.SCREEN_WIDTH;
        canvas.height = this.SCREEN_HEIGHT;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
  
        let dimension;
        while (dimension = this.readImageDimension(dataView, offset)) {
          offset = dimension.newOffset;
          console.log(`Found image with dimensions: ${JSON.stringify(dimension)}`);
          for (let y = dimension.y; y < dimension.height; y++) {
            for (let x = dimension.x; x < dimension.width; x += 2) {
              if (offset >= dataView.byteLength) {
                console.log('Received unexpected end of file stream');
                return;
              }
              const byte = dataView.getUint8(offset++);
              const firstNibble = (byte & 0x0F) << 4;
              const secondNibble = byte & 0xF0;
              ctx.fillStyle = `rgb(${firstNibble}, ${firstNibble}, ${firstNibble})`;
              ctx.fillRect(x, y, 1, 1);
              ctx.fillStyle = `rgb(${secondNibble}, ${secondNibble}, ${secondNibble})`;
              ctx.fillRect(x + 1, y, 1, 1);
            }
          }
        }
  
        this.imgSrc = canvas.toDataURL('image/png');
        this.$emit('update', this.imgSrc);
        console.log('Image rendered to img element');
      },
    },
    watch: {
      url: {
        immediate: true,
        handler() {
          this.fetchAndDecode();
        },
      },
    },
  };
  </script>
  