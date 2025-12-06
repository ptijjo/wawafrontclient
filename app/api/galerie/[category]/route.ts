import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const { category } = await params
        
        // Validation de la catégorie
        const validCategories = ['tatouages', 'coiffure', 'cils']
        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { error: 'Catégorie invalide' },
                { status: 400 }
            )
        }

        // Chemin vers le dossier des images
        const imagesDir = path.join(
            process.cwd(),
            'public',
            'galerie',
            category === 'cils' ? 'cils' : category
        )

        // Vérifier si le dossier existe
        if (!fs.existsSync(imagesDir)) {
            return NextResponse.json(
                { images: [] },
                { status: 200 }
            )
        }

        // Lire les fichiers du dossier
        const files = fs.readdirSync(imagesDir)
        
        // Filtrer les fichiers image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const imageFiles = files.filter(file =>
            imageExtensions.includes(path.extname(file).toLowerCase())
        )

        // Construire les URLs des images
        const images = imageFiles.map(file =>
            `/galerie/${category}/${file}`
        )

        return NextResponse.json({ images }, { status: 200 })
    } catch (error) {
        console.error('Erreur lors de la lecture du dossier:', error)
        return NextResponse.json(
            { error: 'Erreur serveur', images: [] },
            { status: 500 }
        )
    }
}
