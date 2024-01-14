import React, { useEffect, useState } from 'react'

const App = () => {

  const [images, setImages] = useState({ datas: [] })
  const [imagesDecode, setImageDecode] = useState({ data: [] })
  const [fileUploudted, setFileUploudted] = useState({})
  const [data, setData] = useState({ file: "", fileName: "" })

  useEffect(() => {
    async function getImage() {
      try {
        const response = await fetch("http://localhost:8790/api/image/get-all", {
          method: "GET",
        });
        const imageData = await response.json();
        setImages(prev => ({ ...prev, datas: imageData }))
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getImage();
  }, [])

  useEffect(() => {
    decodeBase64ToUrlString(images)
  }, [images.datas])

  const decodeBase64ToUrlString = (arrayData) => {
    let dataUrl
    let arry = []
    for (let index = 0; index < arrayData.datas.length; index++) {
      dataUrl = `data:image/png;base64,${arrayData.datas[index].file}`
      arry.push({ file: dataUrl })
    }
    setImageDecode(prev => ({ ...prev, data: arry }))
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        // Mengambil bagian setelah koma untuk mendapatkan base64 murni
        const base64Data = fileReader.result.split(',')[1];
        resolve(base64Data);
      };

      fileReader.onerror = (err => {
        reject(err)
      })
    })
  }

  const uploudImage = async (e) => {
    e.preventDefault();

    const fileInput = e.target.querySelector('input[type="file"]');
    const fileName = e.target.querySelector('input[type="text"]');

    const file = fileInput.files[0];

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName.value);

      const response = await fetch("http://localhost:8790/api/image/uploud", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error("Server response not OK:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };


  return (
    <div>
      <br />
      <br />
      <form method='POST' encType='multipart/form-data' onSubmit={(e) => uploudImage(e)}>
        <label>Masukan File</label>
        <input type='file' name='file' />

        <label>Masukan Nama</label>
        <input type='text' name='fileName' />

        <button type='submit'>Kirim</button>
      </form>
      <br />
      <br />

      {imagesDecode.data.map((image) => (
        <img key={image.file.length} src={image.file} style={{ rotate: "-90deg" }} width={300} height={300} alt='Orang' />
      ))
      }
    </div>
  )
}

export default App