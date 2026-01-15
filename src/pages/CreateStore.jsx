import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCustomizations, putSiteName, putCustomizationChoice } from '../api/client'
import { setThemes, setFonts, setBackgrounds, setSelection } from '../slices/customizerSlice'
import slugify from '../utils/slugify'
import CustomizationCard from '../components/CustomizationCard'
import { useNavigate } from 'react-router-dom'

export default function CreateStore() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selections = useSelector(s => s.customizer.selections)
  const themes = useSelector(s => s.customizer.themes)
  const fonts = useSelector(s => s.customizer.fonts)
  const backgrounds = useSelector(s => s.customizer.backgrounds)
  const email = useSelector(s => s.auth.email)

  const [name, setName] = useState(selections.name || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const [themesRes, fontsRes, bgRes] = await Promise.all([
          getCustomizations('THEME'),
          getCustomizations('FONT'),
          getCustomizations('BACKGROUND')
        ])
        dispatch(setThemes(themesRes.data))
        dispatch(setFonts(fontsRes.data))
        dispatch(setBackgrounds(bgRes.data))
      } catch (err) {
        console.error('failed fetch customizations', err)
      }
    })()
  }, [dispatch])

  const selectHandler = (type, item) => {
    dispatch(setSelection({ [type.toLowerCase()]: item }))
  }

  const handleCreate = async () => {
    if (!email) return navigate('/auth')
    setLoading(true)
    try {
      // persist name into selections for local state and backend
      dispatch(setSelection({ name }))
      await putSiteName(name)
      // apply chosen customizations; skip if not selected
      if (selections.theme && selections.theme.id) await putCustomizationChoice(selections.theme.id, 'THEME')
      if (selections.font && selections.font.id) await putCustomizationChoice(selections.font.id, 'FONT')
      if (selections.background && selections.background.id) await putCustomizationChoice(selections.background.id, 'BACKGROUND')
      navigate('/stats')
    } catch (err) {
      console.error('create failed', err)
      alert('Ошибка при создании')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Создать магазин</h1>
      <p>Введите заголовок и выберите варианты кастомизации</p>

      <label>Название магазина</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Название" />

      <section>
        <h3>Цветовая палитра</h3>
        <div className="grid grid--single">
          {themes.map(t => (
            <CustomizationCard
              key={t.id}
              item={{ ...t, image: `src/assets/themes/${slugify(t.title)}.png` }}
              selected={selections.theme?.id === t.id}
              onSelect={() => selectHandler('theme', t)}
              variant="wide"
            />
          ))}
        </div>
      </section>

      <section>
        <h3>Шрифты</h3>
        <div className="grid grid--single">
          {fonts.map(f => (
            <CustomizationCard
              key={f.id}
              item={{ ...f, image: `src/assets/fonts/${slugify(f.title)}.png` }}
              selected={selections.font?.id === f.id}
              onSelect={() => selectHandler('font', f)}
              variant="wide"
            />
          ))}
        </div>
      </section>

      <section>
        <h3>Фон</h3>
        <div className="grid grid--two">
          {backgrounds.map(b => (
            <CustomizationCard
              key={b.id}
              item={{ ...b, image: `src/assets/backgrounds/${slugify(b.title)}.png` }}
              selected={selections.background?.id === b.id}
              onSelect={() => selectHandler('background', b)}
              variant="large"
            />
          ))}
        </div>
      </section>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleCreate} disabled={loading}>{loading ? 'Создание...' : 'Создать сайт'}</button>
      </div>
    </div>
  )
}
