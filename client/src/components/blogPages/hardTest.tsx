// Gerekli bağımlılıkları içeri aktarın
'use client';
import React from 'react';
import { useUpdateBlogMutation } from '@/redux/slice/blogApiSlice';

const HardTest = () => {
  const [updateBlog] = useUpdateBlogMutation(); // Mutasyon kancasını parçalayın

  // Buton tıklama işlemini işleyecek fonksiyonu tanımlayın
  const handleClick = async () => {
    try {
      // updateBlog mutasyon fonksiyonunu slug ve veriyle çağırın
      const res = await updateBlog({
        slug: 'blog-333311-deneme-new-code-1113', // Değişken slug değeri ile değiştirin
        data: {
          isPublished: true, // İhtiyaca göre isPublished değerini ayarlayın
        },
      });
      console.log(res); // Gerekirse yanıtı konsola kaydedin
    } catch (error) {
      console.error('Blog güncelleme başarısız oldu:', error);
    }
  };

  // handleClick işlevini tetikleyen bir düğme render edin
  return (
    <div>
      <button onClick={handleClick}>Tıkla</button>
    </div>
  );
};

export default HardTest;
