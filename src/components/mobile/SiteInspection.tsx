
import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Camera as CameraIcon, MapPin, Upload, Edit3 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface InspectionPhoto {
  path: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  notes?: string;
}

export const SiteInspection = () => {
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [currentNotes, setCurrentNotes] = useState<string>("");

  const takePhoto = async () => {
    try {
      // Request camera permissions and take photo
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });

      // Get current location
      const location = await Geolocation.getCurrentPosition();

      const newPhoto: InspectionPhoto = {
        path: image.webPath || '',
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        timestamp: new Date().toISOString(),
        notes: currentNotes
      };

      setPhotos(prev => [...prev, newPhoto]);
      setCurrentNotes("");
      toast({
        title: "Photo captured",
        description: "Photo saved with location data",
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        title: "Error",
        description: "Failed to capture photo",
        variant: "destructive",
      });
    }
  };

  const updateNotes = (photoIndex: number, notes: string) => {
    const updatedPhotos = [...photos];
    updatedPhotos[photoIndex] = { ...updatedPhotos[photoIndex], notes };
    setPhotos(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5" />
            Site Inspection Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <Textarea 
                placeholder="Add inspection notes..."
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={takePhoto}
                className="w-full"
                size="lg"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <Card key={index} className="overflow-hidden">
                  <img 
                    src={photo.path} 
                    alt={`Inspection photo ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {photo.location && (
                        <span>
                          {photo.location.latitude.toFixed(6)}, 
                          {photo.location.longitude.toFixed(6)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(photo.timestamp).toLocaleString()}
                    </div>
                    <Textarea
                      value={photo.notes || ''}
                      onChange={(e) => updateNotes(index, e.target.value)}
                      placeholder="Add notes for this photo..."
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
