import React, { useEffect, useState } from 'react'
import { getPaidItems, getGood, getBrand, getCategory, getCategories, getBrands } from '../api/client'

export default function Stats() {
  const [revenue, setRevenue] = useState(null)
  const [topBrand, setTopBrand] = useState(null)
  const [topCategory, setTopCategory] = useState(null)
  const [topGoods, setTopGoods] = useState([])
  const [bottomCategories, setBottomCategories] = useState([])
  const [bottomBrands, setBottomBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Получаем оплаченные товары
        const paidItemsResponse = await getPaidItems(1000, 0)
        const items = paidItemsResponse.data.items || []

        // Получаем все категории и бренды
        const categoriesResponse = await getCategories()
        const allCategories = categoriesResponse.data || []

        const brandsResponse = await getBrands()
        const allBrands = brandsResponse.data || []

        let totalRevenue = 0
        const brandQuantities = {} // { brandId: количество }
        const categoryQuantities = {} // { categoryId: количество }
        const goodsQuantities = {} // { goodId: { quantity, title } }
        const categoryTitles = {} // { categoryId: title }
        const brandTitles = {} // { brandId: title }
        const goodCache = {} // кеш информации о товарах

        // Сохраняем информацию о всех категориях
        allCategories.forEach(cat => {
          categoryTitles[cat.id] = cat.title
          if (!categoryQuantities[cat.id]) {
            categoryQuantities[cat.id] = 0
          }
        })

        // Сохраняем информацию о всех брендах
        allBrands.forEach(brand => {
          brandTitles[brand.id] = brand.title
          if (!brandQuantities[brand.id]) {
            brandQuantities[brand.id] = 0
          }
        })

        // Для каждого товара получаем его информацию
        for (const item of items) {
          try {
            const goodResponse = await getGood(item.goodId)
            const good = goodResponse.data
            goodCache[good.id] = good
            
            const price = good.price || 0
            totalRevenue += price * item.quantity

            // Подсчитываем количество товаров по брендам
            if (good.brandId) {
              brandQuantities[good.brandId] = (brandQuantities[good.brandId] || 0) + item.quantity
            }

            // Подсчитываем количество товаров по категориям
            if (good.categoryId) {
              categoryQuantities[good.categoryId] = (categoryQuantities[good.categoryId] || 0) + item.quantity
            }

            // Подсчитываем количество каждого товара
            goodsQuantities[good.id] = {
              quantity: (goodsQuantities[good.id]?.quantity || 0) + item.quantity,
              title: good.title
            }
          } catch (err) {
            console.error(`Ошибка при получении информации о товаре ${item.goodId}:`, err)
          }
        }

        setRevenue(totalRevenue)

        // Находим топ-5 самых продаваемых товаров
        const sortedGoods = Object.entries(goodsQuantities)
          .sort(([, a], [, b]) => b.quantity - a.quantity)
          .slice(0, 5)
          .map(([goodId, data]) => ({
            id: goodId,
            title: data.title,
            quantity: data.quantity
          }))
        
        setTopGoods(sortedGoods)

        // Находим топ-5 самых не продаваемых категорий
        const sortedCategories = Object.entries(categoryQuantities)
          .map(([categoryId, quantity]) => ({
            id: categoryId,
            title: categoryTitles[categoryId],
            quantity: quantity
          }))
          .sort((a, b) => a.quantity - b.quantity)
          .slice(0, 5)
        
        setBottomCategories(sortedCategories)

        // Находим топ-5 самых не продаваемых брендов
        const sortedBrands = Object.entries(brandQuantities)
          .map(([brandId, quantity]) => ({
            id: brandId,
            title: brandTitles[brandId],
            quantity: quantity
          }))
          .sort((a, b) => a.quantity - b.quantity)
          .slice(0, 5)
        
        setBottomBrands(sortedBrands)

        // Находим бренд с максимальным количеством проданных товаров
        if (Object.keys(brandQuantities).length > 0) {
          const topBrandId = Object.keys(brandQuantities).reduce((a, b) => 
            brandQuantities[a] > brandQuantities[b] ? a : b
          )
          
          try {
            const brandResponse = await getBrand(topBrandId)
            setTopBrand({
              name: brandResponse.data.title,
              quantity: brandQuantities[topBrandId]
            })
          } catch (err) {
            console.error(`Ошибка при получении информации о бренде ${topBrandId}:`, err)
          }
        }

        // Находим категорию с максимальным количеством проданных товаров
        if (Object.keys(categoryQuantities).length > 0) {
          const topCategoryId = Object.keys(categoryQuantities).reduce((a, b) => 
            categoryQuantities[a] > categoryQuantities[b] ? a : b
          )
          
          try {
            const categoryResponse = await getCategory(topCategoryId)
            setTopCategory({
              name: categoryResponse.data.title,
              quantity: categoryQuantities[topCategoryId]
            })
          } catch (err) {
            console.error(`Ошибка при получении информации о категории ${topCategoryId}:`, err)
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="page">
      <h1>Статистика магазина</h1>
      
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      
      {!loading && !error && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2>Выручка за все время</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
              ₽ {revenue?.toLocaleString('ru-RU')}
            </p>
          </div>

          {topBrand && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Самый продаваемый бренд</h2>
              <p style={{ fontSize: '18px' }}>
                <strong>{topBrand.name}</strong>
              </p>
              <p style={{ fontSize: '16px', color: '#7f8c8d' }}>
                Продано товаров: <strong>{topBrand.quantity}</strong>
              </p>
            </div>
          )}

          {topCategory && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Самая продаваемая категория</h2>
              <p style={{ fontSize: '18px' }}>
                <strong>{topCategory.name}</strong>
              </p>
              <p style={{ fontSize: '16px', color: '#7f8c8d' }}>
                Продано товаров: <strong>{topCategory.quantity}</strong>
              </p>
            </div>
          )}

          {topGoods.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Топ-5 самых продаваемых товаров</h2>
              <ol style={{ fontSize: '16px' }}>
                {topGoods.map((good, index) => (
                  <li key={good.id} style={{ marginBottom: '8px' }}>
                    <strong>{good.title}</strong>
                    <span style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                      ({good.quantity} шт.)
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {bottomCategories.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Топ-5 самых не продаваемых категорий</h2>
              <ol style={{ fontSize: '16px' }}>
                {bottomCategories.map((category, index) => (
                  <li key={category.id} style={{ marginBottom: '8px' }}>
                    <strong>{category.title}</strong>
                    <span style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                      ({category.quantity} шт.)
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {bottomBrands.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Топ-5 самых не продаваемых брендов</h2>
              <ol style={{ fontSize: '16px' }}>
                {bottomBrands.map((brand, index) => (
                  <li key={brand.id} style={{ marginBottom: '8px' }}>
                    <strong>{brand.title}</strong>
                    <span style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                      ({brand.quantity} шт.)
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


