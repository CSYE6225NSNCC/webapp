// aws.pkr.hcl
packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0,<2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  description = "AWS region to use"
  type        = string
  default     = "us-east-1" // Change to your preferred region
}

variable "ami_name" {
  description = "Name of the AMI"
  type        = string
  default     = "custom-ubuntu-24.04-{{timestamp}}"
}

variable "instance_type" {
  description = "Instance type for the builder"
  type        = string
  default     = "t2.micro" // Adjust according to your needs
}

variable "volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 25 // Adjust as needed
}

variable "volume_type" {
  description = "Type of the root volume"
  type        = string
  default     = "gp2" // General Purpose SSD (gp2), provisioned IOPS (io1), etc.
}

source "amazon-ebs" "ubuntu" {
  region           = var.aws_region
  source_ami       = "ami-0866a3c8686eaeeba" // Replace with the official Ubuntu 24.04 AMI ID
  instance_type    = var.instance_type
  ssh_username     = "ubuntu"
  ami_name         = var.ami_name
  ssh_wait_timeout = "10m"
  ami_description  = "Custom Ubuntu 24.04 image with Java, Tomcat, and MySQL"
  tags = {
    Name = "WebApp-Image"
  }

  aws_polling {
    delay_seconds = 120 // Delay between polling attempts
    max_attempts  = 50  // Maximum number of polling attempts
  }

  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = var.volume_size
    delete_on_termination = true
    volume_type           = var.volume_type
  }
}

build {
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /tmp/webapp/",
      "sudo chmod 777 /tmp/webapp"
    ]
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "scripts/install.sh"
  }

  provisioner "shell" {
    script = "scripts/setup_database.sh"
  }

  provisioner "shell" {
    script = "scripts/webapp.sh"
  }

  provisioner "shell" {
    inline = [
      "cd/tmp",
      "unzip -o webapp.zip -d/tmp/webapp"
    ]
  }

  post-processor "manifest" {
    output = "manifest.json"
  }
}