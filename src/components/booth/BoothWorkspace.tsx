'use client'

import BoothNavBar from '@/components/booth/BoothNavBar'
import CameraStep from '@/components/booth/steps/CameraStep'
import EditorStep from '@/components/booth/steps/EditorStep'
import ResultStep from '@/components/booth/steps/ResultStep'
import ThemeStep from '@/components/booth/steps/ThemeStep'
import BackgroundOrbs from '@/components/layout/BackgroundOrbs'
import { cn } from '@/lib/cn'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'

export default function BoothWorkspace() {
  const { step } = usePhotoBoothContext()
  const isEditor = step === 'editor'

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface text-foreground">
      <BackgroundOrbs className="opacity-15" />

      <div
        className={cn(
          'z-10 mx-auto flex w-full flex-1 flex-col',
          isEditor
            ? 'max-w-[90rem] px-4 py-6 sm:px-6 lg:px-10 lg:py-10'
            : 'max-w-6xl justify-center px-5 py-8 sm:px-8 sm:py-10',
          step === 'result' && 'max-w-4xl'
        )}
      >
        {step === 'theme' && <ThemeStep />}
        {step === 'camera' && <CameraStep />}
        {step === 'editor' && <EditorStep />}
        {step === 'result' && <ResultStep />}
      </div>

      <BoothNavBar />
    </main>
  )
}
