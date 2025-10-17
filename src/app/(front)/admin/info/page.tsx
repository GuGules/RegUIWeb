"use client";
import { useCheckSessionForAdmin } from '@/app/lib/ui/checkSession';

/* Import des composants PrimeReact */
import { Card } from 'primereact/card';

/* Import des items du menu */
import { CustomMenubar } from '@/app/lib/menubar_items';

// Import des composants React
import Image from 'next/image';

export default function AppDetailsPage(){
    // Vérification de la session utilisateur;
    useCheckSessionForAdmin();

    return (
        <div>
            <CustomMenubar/>
            <div style={{ height: '1rem'}}></div>
            <div className= "mr-2 ml-2">
                <Card title="A propos de l'application">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image src="/favicon.ico" alt="Logo RegUI" className="" width={20} height={20} style={{width:'20rem', height:'20rem'}} />
                    </div>
                    <div style={{ height: '1rem'}}></div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere lacinia dui, et rutrum leo euismod et. Praesent ac sapien consectetur, elementum ipsum finibus, accumsan odio. Maecenas non sapien mollis, venenatis lorem non, tincidunt dolor. Vestibulum mi arcu, dapibus sit amet mollis quis, cursus vel elit. In eu enim et risus pretium iaculis. Sed sed aliquam enim, sed pretium nisi. Etiam vel massa eu urna blandit suscipit. Ut elementum sodales sapien, vel iaculis dui rutrum id. Donec ut odio eu dui pellentesque condimentum. Sed sed tristique ante, vitae sollicitudin tellus. Etiam sit amet imperdiet lectus.

                    Integer nec pulvinar ligula. Phasellus mattis est ut risus condimentum sollicitudin. Aenean euismod tellus et velit dapibus mollis. Fusce eros mi, pretium at mauris pharetra, ornare ultricies enim. Nullam malesuada libero ut enim bibendum, sed euismod arcu tincidunt. Nullam nec magna dui. Donec ultrices efficitur neque nec viverra. Praesent interdum ex aliquet ipsum euismod facilisis. Aliquam condimentum, eros a eleifend pharetra, mi felis malesuada orci, id maximus risus nisl eu dui. Fusce eu vulputate nibh.
                    </p>
                </Card>
            </div>
        </div>
    )
}